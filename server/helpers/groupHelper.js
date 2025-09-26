function generateCode(length = 6) {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
}

async function generateGroupCode(db) {
  let existingGroup;
  let groupCode;
  do {
    groupCode = generateCode();
    existingGroup = await db.collection("groups").findOne({ groupCode });
  } while (existingGroup);

  return groupCode;
}

async function createGroup(username, db) {
  if (!username) {
    throw Error("Username cannot be null");
  }
  const groupCode = await generateGroupCode(db);

  await db.collection("groups").insertOne({ groupCode, users: [username] });
  await db
    .collection("users")
    .updateOne({ username }, { $set: { groupCode: groupCode } });

  return groupCode;
}

async function joinGroup(username, groupCode, db) {
  const group = db.collection("groups").findOne({ groupCode });

  if (!group) {
    throw Error(`Invalid groupCode ${groupCode}`);
  }
  if (group.users.length > 4) {
    throw Error(`Full group : groupCode ${groupCode}`);
  }

  if (group.users.includes(username)) {
    throw Error(`Group already contains ${username} : groupCode ${groupCode}`);
  }

  await db.collection("users").updateOne({ username }, { $set: { groupCode } });
  await db
    .collection("groups")
    .updateOne({ groupCode }, { $push: { users: username } });
}

async function leaveGroup(username, groupCode, db) {
  const group = db.collection("groups").findOne({ groupCode });

  if (!group) {
    throw Error(`Invalid groupCode ${groupCode}`);
  }

  if (!group.users.includes(username)) {
    throw Error(`Group does not contain ${username}" : groupCode ${groupCode}`);
  }

  await db
    .collection("users")
    .updateOne({ username }, { $set: { groupCode: "" } });
  await db
    .collection("groups")
    .updateOne({ groupCode }, { $pull: { users: username } });
}

async function getUserGroup(username, db) {
  const user = db.collection("users").findOne({ username });

  if (!username) {
    throw Error(`Invalid username ${username}`);
  }

  return user.groupCode;
}

module.exports = {
  createGroup: createGroup,
  joinGroup: joinGroup,
  leaveGroup: leaveGroup,
  getUserGroup: getUserGroup,
};
