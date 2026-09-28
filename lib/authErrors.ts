export function translateAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('invalid login credentials')) return 'Email hoặc mật khẩu không đúng.';
  if (m.includes('user already registered') || m.includes('already registered'))
    return 'Email này đã được đăng ký. Hãy đăng nhập thay vì đăng ký lại.';
  if (m.includes('password') && m.includes('at least')) return 'Mật khẩu cần ít nhất 6 ký tự.';
  if (m.includes('email') && m.includes('invalid')) return 'Email không hợp lệ.';
  if (m.includes('email not confirmed'))
    return 'Email chưa được xác nhận. Kiểm tra hộp thư để xác nhận tài khoản.';
  if (m.includes('network')) return 'Lỗi kết nối mạng. Vui lòng thử lại.';
  return message;
}
