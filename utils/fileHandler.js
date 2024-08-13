import multer from 'multer'
import path from'path'

const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, './public/upload')
    },
    filename: (req, file, cb)=>{
        const fileExt = path.extname(file.originalname)
        const fileName = file.originalname
                                .replace(fileExt, '')
                                .toLocaleLowerCase()
                                .split(' ')
                                .join('-') +'-'+Date.now()
        cb(null, fileName + fileExt)
    }
})


const upload = multer({
        storage : storage,
        limits:{
            fileSize:10*1024*1024
        },
        fileFilter:(req, file, cb)=>{
            if(file.fieldname === 'image'){
                if(
                    file.mimetype === 'image/png'||
                    file.mimetype === 'image/jpg'||
                    file.mimetype === 'image/jpeg'
                ){
                    cb(null, true)
                } else{
                    cb(new Error('only png ,jpg and jpeg format are allowed')
                    )
                }
            } else if(file.fieldname === 'resume'){
                if(
                    file.mimetype === 'application/pdf'

                ){
                    cb(null, true)
                } else{
                    cb(new Error('only pdf format are allowed')
                    )
                }
            } else{
                cb(new Error('invalid file name'))
            }
        
        }
})

const multerUploader = upload.fields([
{
name: 'image', maxCount: 1
},
{
name: 'resume', maxCount: 1
}
])
export default multerUploader

/// err instanceof multer.MulterError
/// single hole req.file and multiple hole req.files