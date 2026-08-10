exports.uploadImage = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('Vui lòng chọn một file ảnh!');
        }

        // Spring Boot cũ trả về tên file dạng Text thô (ResponseEntity.ok(fileName))
        // Node.js cũng sẽ trả về y hệt để Vue.js đọc được
        res.status(200).send(req.file.originalname);

    } catch (error) {
        console.error('Lỗi upload ảnh:', error);
        res.status(500).send('Lỗi khi lưu ảnh vào thư mục!');
    }
};