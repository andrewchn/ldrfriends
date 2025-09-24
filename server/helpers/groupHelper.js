function generateCode(length = 6) {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
}

async function generateGroupCode(db) {
  let existingGroup;
  do {
    const groupCode = generateCode();
    existingGroup = db.collection("groups").findOne({ groupCode });
  } while (existingGroup);

  return groupCode;
}

async function joinGroup(username, groupCode, db) {
  const group = db.collection("groups").findOne({ groupCode });

  if (!group) {
    throw exception(`Invalid groupeCode ${groupCode}`);
  }
  if (group.users.length > 4) {
    throw exception(`Full group : groupCode ${groupCode}`);
  }

  if (group.users.includes(user)) {
    throw exception(
      `Group already contains ${username}"} : groupCode ${groupCode}`
    );
  }

  await db.collection("users").updateOne({ username }, { $set: { groupCode } });
  await db
    .collection("groups")
    .updateOne({ groupCode }, { $push: { users: username } });
}

module.exports = {
  generateGroupCode: generateGroupCode,
};
