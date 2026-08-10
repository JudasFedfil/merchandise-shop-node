const { User } = require('../models');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) { res.status(500).json({ message: 'Lỗi server' }); }
};

exports.login = async (req, res) => {
    try {
        const username = req.body.username || req.query.username;
        const password = req.body.password || req.query.password;
        const user = await User.findOne({ where: { username, password } });
        if (user) res.status(200).json(user);
        else res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
    } catch (error) { res.status(500).json({ message: 'Lỗi server' }); }
};

exports.createUser = async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json(newUser);
    } catch (error) { res.status(500).json({ message: 'Lỗi khi tạo User' }); }
};

exports.updateUser = async (req, res) => {
    try {
        await User.update(req.body, { where: { id: req.params.id } });
        res.status(200).json({ message: 'Cập nhật thành công' });
    } catch (error) { res.status(500).json({ message: 'Lỗi cập nhật' }); }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.destroy({ where: { id: req.params.id } });
        res.status(200).json({ message: 'Xóa thành công' });
    } catch (error) { res.status(500).json({ message: 'Lỗi xóa User' }); }
};