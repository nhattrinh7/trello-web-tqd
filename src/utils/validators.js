

// Một vài biểu thức chính quy - Regular Expression và custom message.
// Về Regular Expression khá hại não: https://viblo.asia/p/hoc-regular-expression-va-cuoc-doi-ban-se-bot-kho-updated-v22-Az45bnoO5xY
export const FIELD_REQUIRED_MESSAGE = 'This field is required.'
export const EMAIL_RULE = /^\S+@\S+\.\S+$/
export const EMAIL_RULE_MESSAGE = 'Email is invalid. (example@trinhminhnhat.com)'
export const PASSWORD_RULE = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d\W]{8,256}$/
export const PASSWORD_RULE_MESSAGE = 'Password must include at least 1 letter, a number, and at least 8 characters.'
export const PASSWORD_CONFIRMATION_MESSAGE = 'Password Confirmation does not match!'


// Liên quan đến Validate File (ảnh :))
export const LIMIT_COMMON_FILE_SIZE = 10 * 1024 * 1024 // byte = 10 MB
export const ALLOW_COMMON_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png']
export const singleFileValidator = (file) => {
  if (!file || !file.name || !file.size || !file.type) {
    return 'File cannot be blank.'
  }
  if (file.size > LIMIT_COMMON_FILE_SIZE) {
    return 'Maximum file size exceeded. (10MB)'
  }
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.type)) {
    return 'File type is invalid. Only accept jpg, jpeg and png'
  }
  return null
}

// Liên quan đến Validate File attachments
export const maxFileSize = 20 * 1024 * 1024 // byte = 20 MB
export const allowedFileTypes = [
  'image/jpg', 'image/jpeg', 'image/png',
  'application/pdf'
]

export const multipleAttachmentValidator = (files) => {
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (!file || !file.name || !file.size || !file.type) {
      return 'File cannot be blank.'
    }
    if (file.size > maxFileSize) {
      return `File ${file.name} exceeds the maximum size of 20MB.`
    }
    if (!allowedFileTypes.includes(file.type)) {
      return `File ${file.name} is not an allowed file type. Only accept jpg, jpeg, png, doc, docx, pdf, zip, and rar.`
    }
  }
  return null
}