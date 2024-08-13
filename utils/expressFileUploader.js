import path from 'path'
const fileValidator = (file)=>{
    const ext = path.extname(file.originalname)
    const imageSize = file.size/(1024*1024)
    const resumeSize = file.size/(1024*1024)

    const fileName =  file.originalname
                            .replace(ext, '')
                            .toLocaleLowerCase()
                            .split('')
                            .join('-')+'-'+Date.now()+ext

    if(file.fieldname === 'image'){
        if((ext !== 'jpg' || ext !== 'jpeg' || ext !== 'png') || imageSize > 10){
            return {
                success:false,
                message : 'file formation is not valid'
            }
        }
    }
    if(file.fieldname === 'resume' || resumeSize > 5){
        if(ext !== 'pdf'){
            return {
                success:false,
                message : 'file formation is not valid'
            }
        }
    }
    

    return {
        success:true,
        message : 'file formation is valid'
    }
}
export default fileValidator