import multer from 'multer'
import path from'path'

const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, path.join(__dirname,'./public/upload'))
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
            fileSize:100000
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
            }

            if(file.fieldname === 'resume'){
                if(
                    file.mimetype === 'application/pdf'

                ){
                    cb(null, true)
                } else{
                    cb(new Error('only pdf format are allowed')
                    )
                }
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