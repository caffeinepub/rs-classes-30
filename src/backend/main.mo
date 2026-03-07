import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Char "mo:core/Char";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    phone : ?Text;
    name : Text;
    classNumber : ?Nat;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public type ContentType = {
    #liveClass;
    #recordedClass;
    #pdfNotes;
    #quiz;
  };

  public type SubjectId = Nat;
  public type ContentId = Nat;
  public type Phone = Text;
  public type ClassNumber = Nat;

  public type Subject = {
    id : SubjectId;
    classNumber : ClassNumber;
    name : Text;
  };

  type Question = {
    text : Text;
    options : [Text];
    correctOption : Nat;
  };

  type Quiz = {
    contentId : ContentId;
    title : Text;
    questions : [Question];
  };

  public type Content = {
    id : ContentId;
    classNumber : ClassNumber;
    subjectId : SubjectId;
    contentType : ContentType;
    title : Text;
    link : Text;
    description : Text;
  };

  type Doubt = {
    id : Nat;
    phone : Phone;
    classNumber : ClassNumber;
    subjectId : SubjectId;
    subjectName : Text;
    doubtText : Text;
    reply : ?Text;
    timestamp : Time.Time;
  };

  type OTP = {
    phone : Phone;
    code : Text;
    timestamp : Time.Time;
  };

  public type Student = {
    phone : Phone;
    name : Text;
    classNumber : ClassNumber;
  };

  module Subject {
    public func compare(subject1 : Subject, subject2 : Subject) : Order.Order {
      Nat.compare(subject1.id, subject2.id);
    };
  };

  module Content {
    public func compare(content1 : Content, content2 : Content) : Order.Order {
      Nat.compare(content1.id, content2.id);
    };
  };

  var nextSubjectId = 1;
  var nextContentId = 1;
  var nextDoubtId = 1;

  let subjects = Map.empty<SubjectId, Subject>();
  let quizzes = Map.empty<ContentId, Quiz>();
  let content = Map.empty<ContentId, Content>();
  let doubts = Map.empty<Nat, Doubt>();

  let students = Map.empty<Phone, Student>();
  let otps = Map.empty<Phone, OTP>();

  func classToDigit(classNumber : Nat) : Text {
    if (classNumber >= 1 and classNumber <= 9) { classNumber.toInt().toText() } else if (classNumber == 10 or classNumber == 12) {
      (classNumber / 10).toText() # (classNumber % 10).toText();
    } else if (classNumber == 11) { "11" } else {
      Runtime.trap("Invalid class: " # classNumber.toText());
    };
  };

  // OTP Simulation - Public (no auth required)
  public shared ({ caller }) func requestOtp(phone : Phone) : async Text {
    if (phone.size() != 10 or not phone.chars().all(func(c) { c >= '0' and c <= '9' })) {
      Runtime.trap("Invalid phone number");
    };
    switch (Int.fromText(phone)) {
      case (?number) {
        let otp = Int.abs(number) % 10000;
        let otpStr = Int.abs(otp).toText();
        let otpObj : OTP = {
          phone;
          code = otpStr;
          timestamp = Time.now();
        };
        otps.add(phone, otpObj);
        otpObj.code;
      };
      case (null) { Runtime.trap("Invalid phone number") };
    };
  };

  // Verify OTP - Public (no auth required)
  public shared ({ caller }) func verifyOtp(phone : Phone, otp : Text) : async Bool {
    switch (otps.get(phone)) {
      case (null) { Runtime.trap("OTP not found") };
      case (?storedOtp) {
        if (storedOtp.code == otp) {
          otps.remove(phone);
          true;
        } else { Runtime.trap("Invalid OTP: " # otp) };
      };
    };
  };

  // Admin login (password check) - Public (no auth required)
  public shared ({ caller }) func adminLogin(password : Text) : async Bool {
    if (password == "Admin@RS30") { true } else { Runtime.trap("Incorrect password") };
  };

  // Add a new subject (admin only)
  public shared ({ caller }) func addSubject(classNumber : ClassNumber, name : Text) : async SubjectId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add subjects");
    };

    let validClass = Nat.range(1, 12).any(func(n) { n == classNumber });
    if (not validClass) { Runtime.trap("Invalid class: " # classNumber.toText()) };

    let subject : Subject = {
      id = nextSubjectId;
      classNumber;
      name;
    };

    let subjectKey = classToDigit(classNumber) # name;

    if (subjects.values().any(func(s) { (classToDigit(s.classNumber) # s.name) == subjectKey })) {
      Runtime.trap("Subject already exists for class " # classNumber.toText() # ": " # name);
    };

    subjects.add(nextSubjectId, subject);
    let currentId = nextSubjectId;
    nextSubjectId += 1;
    currentId;
  };

  // Fetch all subjects for a class - Public (no auth required)
  public query ({ caller }) func getSubjects(classNumber : ClassNumber) : async [Subject] {
    let classSubjects = subjects.values().toArray().filter(
      func(s) { s.classNumber == classNumber }
    );
    classSubjects.sort();
  };

  // Delete a subject (admin only)
  public shared ({ caller }) func deleteSubject(id : SubjectId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete subjects");
    };

    switch (subjects.get(id)) {
      case (null) { Runtime.trap("Subject not found") };
      case (_) {
        subjects.remove(id);
      };
    };
  };

  // Add content (admin only)
  public shared ({ caller }) func addContent(
    classNumber : ClassNumber,
    subjectId : SubjectId,
    contentType : ContentType,
    title : Text,
    link : Text,
    description : Text,
  ) : async ContentId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add content");
    };

    let contentObj : Content = {
      id = nextContentId;
      classNumber;
      subjectId;
      contentType;
      title;
      link;
      description;
    };

    content.add(nextContentId, contentObj);
    let currentId = nextContentId;
    nextContentId += 1;
    currentId;
  };

  // Fetch all content for a given class, subject and type - Public (no auth required)
  public query ({ caller }) func getContent(
    classNumber : ClassNumber,
    subjectId : SubjectId,
    contentType : ContentType,
  ) : async [Content] {
    let filtered = content.values();
    let filteredByClass = filtered.filter(
      func(c) { c.classNumber == classNumber }
    );
    let filteredBySubject = filteredByClass.filter(
      func(c) { c.subjectId == subjectId }
    );
    let finalFiltered = filteredBySubject.filter(
      func(c) { c.contentType == contentType }
    );
    finalFiltered.toArray().sort();
  };

  // Delete content (admin only)
  public shared ({ caller }) func deleteContent(id : ContentId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete content");
    };

    switch (content.get(id)) {
      case (null) { Runtime.trap("Content not found: " # id.toText()) };
      case (_) {
        content.remove(id);
      };
    };
  };

  // Add a quiz (admin only)
  public shared ({ caller }) func addQuiz(contentId : ContentId, title : Text, questions : [Question]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add quizzes");
    };

    switch (content.get(contentId)) {
      case (null) { Runtime.trap("Content not found") };
      case (_) {
        let quiz = {
          contentId;
          title;
          questions;
        };
        quizzes.add(contentId, quiz);
      };
    };
  };

  // Get quiz for content - Public (no auth required)
  public query ({ caller }) func getQuiz(contentId : ContentId) : async Quiz {
    switch (quizzes.get(contentId)) {
      case (null) { Runtime.trap("Quiz not found for content: " # contentId.toText()) };
      case (?quiz) { quiz };
    };
  };

  // Submit doubt (authenticated users only)
  public shared ({ caller }) func submitDoubt(
    phone : Phone,
    classNumber : ClassNumber,
    subjectId : SubjectId,
    subjectName : Text,
    doubtText : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit doubts");
    };

    if (doubtText.isEmpty()) { Runtime.trap("Doubt text cannot be empty") };

    let doubt = {
      id = nextDoubtId;
      phone;
      classNumber;
      subjectId;
      subjectName;
      doubtText;
      reply = null;
      timestamp = Time.now();
    };

    doubts.add(nextDoubtId, doubt);
    nextDoubtId += 1;
  };

  // Get doubts specific to student (authenticated users only)
  public query ({ caller }) func getMyDoubts(phone : Phone) : async [Doubt] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their doubts");
    };

    let filtered = doubts.values().filter(
      func(d) { d.phone == phone }
    );
    filtered.toArray();
  };

  // Get all doubts (admin only)
  public query ({ caller }) func getAllDoubts() : async [Doubt] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all doubts");
    };

    doubts.values().toArray();
  };

  // Reply to doubt (admin only)
  public shared ({ caller }) func replyDoubt(id : Nat, reply : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can reply to doubts");
    };

    switch (doubts.get(id)) {
      case (null) { Runtime.trap("Doubt not found") };
      case (?doubt) {
        let updatedDoubt = {
          id = doubt.id;
          phone = doubt.phone;
          classNumber = doubt.classNumber;
          subjectId = doubt.subjectId;
          subjectName = doubt.subjectName;
          doubtText = doubt.doubtText;
          reply = ?reply;
          timestamp = doubt.timestamp;
        };
        doubts.add(id, updatedDoubt);
      };
    };
  };

  // Update student name (authenticated users only)
  public shared ({ caller }) func updateStudentName(phone : Phone, name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update student names");
    };

    switch (students.get(phone)) {
      case (null) { Runtime.trap("Student not found") };
      case (?student) {
        let updatedStudent = {
          phone = student.phone;
          name;
          classNumber = student.classNumber;
        };
        students.add(phone, updatedStudent);
      };
    };
  };

  // Get student by phone - Public (no auth required)
  public query ({ caller }) func getStudent(phone : Phone) : async Student {
    switch (students.get(phone)) {
      case (null) { Runtime.trap("Student not found: " # phone) };
      case (?student) { student };
    };
  };

  // Register student (authenticated users only)
  public shared ({ caller }) func registerStudent(phone : Phone, classNumber : ClassNumber) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can register students");
    };

    switch (students.get(phone)) {
      case (null) {
        let student = {
          phone;
          name = "";
          classNumber;
        };
        students.add(phone, student);
      };
      case (_) {
        Runtime.trap("Student already exists for phone: " # phone);
      };
    };
  };
};
