import Map "mo:core/Map";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Principal "mo:core/Principal";

module {
  type SubjectId = Nat;
  type ContentId = Nat;
  type Phone = Text;
  type ClassNumber = Nat;

  type Subject = {
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

  type Content = {
    id : ContentId;
    classNumber : ClassNumber;
    subjectId : SubjectId;
    contentType : {
      #liveClass;
      #recordedClass;
      #pdfNotes;
      #quiz;
    };
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

  type Student = {
    phone : Phone;
    name : Text;
    classNumber : ClassNumber;
  };

  type UserProfile = {
    phone : ?Text;
    name : Text;
    classNumber : ?Nat;
  };

  type OldActor = {
    nextSubjectId : Nat;
    nextContentId : Nat;
    nextDoubtId : Nat;
    subjects : Map.Map<SubjectId, Subject>;
    quizzes : Map.Map<ContentId, Quiz>;
    content : Map.Map<ContentId, Content>;
    doubts : Map.Map<Nat, Doubt>;
    students : Map.Map<Phone, Student>;
    otps : Map.Map<Phone, OTP>;
    userProfiles : Map.Map<Principal, UserProfile>;
  };

  type Announcement = {
    id : Nat;
    title : Text;
    message : Text;
    timestamp : Time.Time;
  };

  type NewActor = {
    nextSubjectId : Nat;
    nextContentId : Nat;
    nextDoubtId : Nat;
    nextAnnouncementId : Nat;
    subjects : Map.Map<SubjectId, Subject>;
    quizzes : Map.Map<ContentId, Quiz>;
    content : Map.Map<ContentId, Content>;
    doubts : Map.Map<Nat, Doubt>;
    announcements : Map.Map<Nat, Announcement>;
    students : Map.Map<Phone, Student>;
    otps : Map.Map<Phone, OTP>;
    userProfiles : Map.Map<Principal, UserProfile>;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      nextAnnouncementId = 1;
      announcements = Map.empty<Nat, Announcement>();
    };
  };
};
