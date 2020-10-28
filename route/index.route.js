const express = require('express');
const router = express.Router();
const Data = require('./aws');
const { v4: uuidv4 } = require('uuid');

router.get('', (req, res) => {
    res.render('index');
})

router.get('/students', (req, res) => {
    Data.getAllItem(res);
})

router.get('/add-student', (req, res) => {
    res.render('addStudent');
})

router.post('/add-student', (req, res) => {
    let id = uuidv4();
    let ma_sinhvien = req.body.ma_sinhvien;
    let ten_sinhvien = req.body.ten_sinhvien;
    let namsinh = req.body.namsinh;
    let ma_lop = req.body.ma_lop;
    let file = req.body.avatar;

    Data.createItem(id, ma_sinhvien, ten_sinhvien, namsinh, ma_lop, '', res);
    Data.uploadImage(id, file, res);
})

router.get('/student/:id/:avatar', (req, res) =>{
    let id = req.params.id;
    let file = req.params.avatar;
    Data.deleteItem(id, res);
    Data.deleteImage(id, file);
})

router.post('/student', (req, res) => {
  let id = req.body.id;
  let ma_sinhvien = req.body.ma_sinhvien;
  let ten_sinhvien = req.body.ten_sinhvien;
  let namsinh = req.body.namsinh;
  let ma_lop = req.body.ma_lop;
  let avatar = req.body.avatar;
  Data.updateItem(id, ma_sinhvien, ten_sinhvien, namsinh, ma_lop, res);
  Data.uploadImage(id, avatar, res);
})

module.exports = router;
