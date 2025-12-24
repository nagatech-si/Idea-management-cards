# Authentication & Login System Documentation

## Overview
Sistem authentication lengkap dengan login page, routing protection, dan localStorage management.

## File yang Dibuat/Dimodifikasi

### 1. **src/lib/authContext.tsx** (NEW)
Context provider untuk state authentication global.

**Features:**
- User management (id, email, nama)
- Authentication state check
- Login/Logout functions
- localStorage persistence

**Data yang disimpan di localStorage:**
```javascript
localStorage.setItem("user", JSON.stringify(userData))
localStorage.setItem("loginTimestamp", new Date().toISOString())
localStorage.setItem("loginEmail", email)
```

### 2. **src/app/pages/login/index.tsx** (UPDATED)
Professional login page dengan:
- Form input (Nama, Email, Password)
- Error handling dengan toast notifications
- Loading state
- Responsive design
- Demo mode info

**Fitur:**
- Validasi form (semua field harus diisi)
- Toast notifications untuk success/error
- Gradient background
- Mobile-friendly layout

### 3. **src/app/App.tsx** (UPDATED)
Main component dengan routing logic:
- **AuthProvider wrapper** - Menyediakan auth context ke seluruh app
- **Conditional rendering** - Tampil LoginPage atau DashboardPage berdasarkan status login
- **Loading state** - Spinner saat checking login status
- **Toaster configuration** - Global notification system

**Routes:**
```
/            -> Jika login: DashboardPage, Jika belum: LoginPage
```

### 4. **src/app/pages/dashboard/index.tsx** (UPDATED)
Dashboard dengan user info dan logout:
- Menampilkan nama user di header
- Logout button dengan confirmation
- User avatar/icon
- Toast notification saat logout

## Cara Kerja

### Flow Login
1. User input Nama, Email, Password di LoginPage
2. Klik "Login" → `useAuth().login()` dipanggil
3. Data user disimpan ke localStorage
4. User state di-update → React re-render
5. App.tsx mendeteksi isAuthenticated = true
6. Redirect ke DashboardPage

### Flow Logout
1. User klik "Logout" di header Dashboard
2. Confirmation dialog muncul
3. Jika confirm → `useAuth().logout()` dipanggil
4. Data di localStorage dihapus
5. User state di-clear
6. App.tsx mendeteksi isAuthenticated = false
7. Redirect ke LoginPage

### Data Persistence
Saat browser refresh:
1. App.tsx render → AuthProvider init
2. AuthContext useEffect check localStorage
3. Jika ada user data → restore ke state
4. User tetap login

## localStorage Structure
```javascript
{
  "user": {
    "id": "random-id-string",
    "email": "user@example.com",
    "nama": "Nama User"
  },
  "loginTimestamp": "2024-12-24T10:00:00.000Z",
  "loginEmail": "user@example.com"
}
```

## API Endpoints (Demo)
Saat ini menggunakan mock authentication. Untuk menggunakan API real:

Update `src/lib/authContext.tsx` - function `login`:
```typescript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password, nama })
})
const userData = await response.json()
```

## Troubleshooting

### User tidak bisa login
- Pastikan semua field diisi (Nama, Email, Password)
- Check browser console untuk error messages

### User kehilangan session saat refresh
- Check localStorage apakah `user` key tersimpan
- Clear browser cache dan coba login lagi

### Logout tidak bekerja
- Pastikan localStorage cleared dengan baik
- Check console untuk error messages

## Testing Checklist
- [x] Login dengan berbagai data
- [x] Toast notifications muncul
- [x] Browser refresh tetap login
- [x] Logout dan clear localStorage
- [x] Protected route berfungsi
- [x] User info ditampilkan di dashboard
