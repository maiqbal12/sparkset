const AV = require("leanengine");
AV.Cloud.beforeSave("Note", request => {
  request.object.set("owner", request.currentUser);
});
AV.Cloud.beforeSave("_User", request => {
  if (request.currentUser) {
    if (!request.currentUser.get("allowAddingNewUsers")) {
      throw new AV.Cloud.Error("You are not allowed to add new users.");
    }
  } else {
    throw new AV.Cloud.Error("You are not logged in.");
  }
});
AV.Cloud.afterSave("Client", request => {
  const events = [
    {
      name: "Welcome Email With Next Steps",
      delay: 1
    },
    {
      name: "Welcome Package",
      delay: 2
    },
    {
      name: "Kick-Off Meeting, Team Introduction, Goal-Setting",
      delay: 3
    },
    {
      name: "Account Health Check",
      delay: 90
    },
    {
      name: "Monthly Status Report and Budget Updates",
      recursIn: 30
    },
    {
      name: "Weekly Communication Touchpoints",
      recursIn: 7
    },
    {
      name: "Monthly In-Person Meeting",
      recursIn: 30,
      delay: 5
    },
    {
      name: "Bi-Monthly Non-Business Function",
      recursIn: 60
    },
    {
      name: "Birthday Gift and Personalized Note",
      recursIn: 365
    },
    {
      name: "Monthly Article, Book, Tip or Recommendation",
      recursIn: 30,
      delay: 15
    }
  ];
  AV.Object.saveAll(
    events.map(event =>
      new AV.Object("Event")
        .set("client", request.object)
        .set("name", event.name)
        .set("recursIn", event.recursIn)
        .set(
          "time",
          new Date(
            new Date(
              new Date().setDate(
                new Date().getDate() +
                  (event.recursIn || 0) +
                  (event.delay || 0)
              )
            ).setSeconds(0)
            
          )
        )
    )
  );
});
