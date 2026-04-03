const User = require("../models/User");

exports.createUser = async (data) => User.create(data);

exports.getUsers = async ({ page, limit, search }) => {
  const query = {
    isDeleted: false,
    ...(search && { name: { $regex: search, $options: "i" } })
  };

  const users = await User.find(query)
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await User.countDocuments(query);

  return { data: users, total, page, totalPages: Math.ceil(total / limit) };
};

exports.getUserById = async (id) =>
  User.findOne({ _id: id, isDeleted: false });

exports.updateUser = async (id, data) =>
  User.findByIdAndUpdate(id, data, { new: true });

exports.softDeleteUser = async (id) =>
  User.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() });
