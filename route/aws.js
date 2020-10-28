const AWS = require('aws-sdk');
const fs = require('fs');
const sharp = require('sharp');
AWS.config.update({
    region: "ap-southeast-1",
/*    endpoint: process.env.ENDPOINT,*/
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
});

let docClient = new AWS.DynamoDB.DocumentClient();
let s3 = new AWS.S3({apiVersion: '2006-03-01'});

function uploadImage(id, file, res){
    var uploadParams = {
        ACL:"public-read",
        Bucket: process.env.S3_BUCKET,
        Key: '',
        Body: ''
    };
    var file = file;
    var fs = require('fs');
    var fileStream = fs.createReadStream(file);
    fileStream.on('error', function(err) {
        console.log('File Error', err);
    });
    uploadParams.Body = fileStream;
    var path = require('path');
    uploadParams.Key = path.basename(file);

// call S3 to retrieve upload file to specified bucket
    s3.upload (uploadParams, function (err, data) {
        if (err) {
            console.log("Error", err);
        } if (data) {
            console.log("Upload Success", data.Location);
            setAvatar(id, data.Location, res);
        }
    });
}

function setAvatar(id, avatar, res){
    let params = {
        TableName: "student",
        Key: {
            id: String(id),
        },
        UpdateExpression: "set avatar = :avatar",
        ExpressionAttributeValues: {
            ':avatar': String(avatar)
        }
    };
    docClient.update(params, ((err, data) => {
        if(err){
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({
                error: 'Lỗi không thể update item, vui lòng cung cấp đủ các tham số',
            }))
            console.log(err);
        } else {
            /*res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({
                message: 'Sửa thành công',
                change: data.Attributes
            }))*/
        }
    }))
}

function deleteAvatar(id, avatar){
    var params = {
        Bucket: process.env.S3_BUCKET,
        Key: avatar
    };
    s3.deleteObject(params, function (err, data){
       if(err)
           console.log(err, err.stack);
       else
           console.log(data);
    });
}

function getAllItem(res){
    let params = {
        TableName: "student"
    }

    docClient.scan(params, ((err, data) => {
        if(err){
            console.log('err: ', err);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({
                error: 'Lỗi không thể truy xuất dữ liệu'
            }));
        } else {
/*            res.writeHead(200, {'Content-Type': 'application/json'});*/
            // if(data.Items.length === 0){
            //     res.end(JSON.stringify({
            //         message: 'Table rộng, không có item nào'
            //     }))
            // }

            let student = [];

            data.Items.forEach((item, index) => {
                student.push(item);
            });

            res.render('listStudents', {
                students: student
            })
            // res.end(JSON.stringify(data.Items));
        }
    }))
}

function createItem(id, ma_sinhvien, ten_sinhvien, namsinh, ma_lop, avatar, res){
    let params = {
        TableName: "student",
        Item: {
            id: id,
            ma_sinhvien: ma_sinhvien,
            ten_sinhvien: ten_sinhvien,
            namsinh: namsinh,
            ma_lop: ma_lop,
            avatar: avatar
        }
    }

    console.log('params : ', params);

    docClient.put(params, ((err, data) => {
        if(err){
            console.log('err : ', err);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: 'Lỗi không thêm item, vui lòng cung cấp đủ các tham số'}))
        } else {
/*            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({
                message: 'Thêm thành công',
                student: {
                    id: params.Item.id,
                    ma_sinhvien: params.Item.ma_sinhvien,
                    ten_sinhvien: params.Item.ten_sinhvien,
                    namsinh: params.Item.namsinh,
                    ma_lop: params.Item.ma_lop,
                    avatar: params.Item.avatar
                }
            }))*/
            res.redirect('/students')
        }
    }))
}

function updateItem(id, ma_sinhvien, ten_sinhvien, namsinh, ma_lop, res){
    let params = {
        TableName: "student",
        Key: {
            id: String(id),
        },
        UpdateExpression: "set ma_sinhvien = :ma_sinhvien, ten_sinhvien = :ten_sinhvien, namsinh = :namsinh, ma_lop = :ma_lop",
        ExpressionAttributeValues: {
            ':ma_sinhvien': String(ma_sinhvien),
            ':ten_sinhvien': String(ten_sinhvien),
            ':namsinh': String(namsinh),
            ':ma_lop': String(ma_lop)
        }
    };
    docClient.update(params, ((err, data) => {
        if(err){
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({
                error: 'Lỗi không thể update item, vui lòng cung cấp đủ các tham số',
            }))
            console.log(err);
        } else {
            /*res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({
                message: 'Sửa thành công',
                change: data.Attributes
            }))*/
            res.redirect('/students')
        }
    }))
}

function deleteItem(id, res){
    let params = {
        TableName: 'student',
        Key: {
            id: String(id)
        }
    }

    docClient.delete(params, ((err, data) => {
        if(err){
            console.log(err);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({
                error: 'Lỗi không thể delete item, vui lòng cung cấp đủ các tham số'
            }));
        } else {
            /*res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({
                message: 'Xoá thành công',
                student: {
                    id: id
                }
            }))*/
            res.redirect('/students')
        }
    }))
}

module.exports = {
    getAllItem: getAllItem,
    createItem: createItem,
    updateItem: updateItem,
    deleteItem: deleteItem,
    uploadImage: uploadImage,
    deleteImage: deleteAvatar
}
