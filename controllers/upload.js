export const postUploadImage = (req,res) => {
    res.json({
        name: req.file.originalname,
        link: `${process.env.HOST_NAME}/images/${req.file.filename}`
    });
};

export const postUploadFile = (req,res) => {
    res.json({
        name: req.file.originalname,
        link: `${process.env.HOST_NAME}/files/${req.file.filename}`
    });
};