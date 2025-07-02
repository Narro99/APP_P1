export const languages = {
  en: 'English',
  es: 'Español'
} as const;

export type Language = keyof typeof languages;

export const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    employees: 'Employees',
    attendance: 'Attendance',
    leaves: 'Leave Management',
    payroll: 'Payroll',
    projects: 'Projects',
    reports: 'Reports',
    settings: 'Settings',
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    add: 'Add',
    create: 'Create',
    update: 'Update',
    search: 'Search',
    filter: 'Filter',
    loading: 'Loading',
    actions: 'Actions',
    status: 'Status',
    date: 'Date',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    department: 'Department',
    position: 'Position',
    location: 'Location',
    notes: 'Notes',
    submit: 'Submit',
    close: 'Close',
    view: 'View',
    download: 'Download',
    export: 'Export',
    import: 'Import',
    refresh: 'Refresh',
    
    // Auth
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    login: 'Login',
    register: 'Register',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot Password?',
    createAccount: 'Create Account',
    welcomeToArcusHR: 'Welcome to ArcusHR',
    signInToAccount: 'Sign in to your account',
    createCompany: 'Create Company',
    
    // Employee Portal
    myProfile: 'My Profile',
    myAttendance: 'My Attendance',
    myLeaves: 'My Leave Requests',
    myPayslips: 'My Payslips',
    employeePortal: 'Employee Portal',
    
    // Time
    hours: 'hours',
    days: 'days',
    today: 'Today',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
  },
  es: {
    // Navigation
    dashboard: 'Panel de Control',
    employees: 'Empleados',
    attendance: 'Asistencia',
    leaves: 'Gestión de Permisos',
    payroll: 'Nómina',
    projects: 'Proyectos',
    reports: 'Reportes',
    settings: 'Configuración',
    
    // Common
    save: 'Guardar',
    cancel: 'Cancelar',
    edit: 'Editar',
    delete: 'Eliminar',
    add: 'Agregar',
    create: 'Crear',
    update: 'Actualizar',
    search: 'Buscar',
    filter: 'Filtrar',
    loading: 'Cargando',
    actions: 'Acciones',
    status: 'Estado',
    date: 'Fecha',
    name: 'Nombre',
    email: 'Correo',
    phone: 'Teléfono',
    department: 'Departamento',
    position: 'Cargo',
    location: 'Ubicación',
    notes: 'Notas',
    submit: 'Enviar',
    close: 'Cerrar',
    view: 'Ver',
    download: 'Descargar',
    export: 'Exportar',
    import: 'Importar',
    refresh: 'Actualizar',
    
    // Auth
    signIn: 'Iniciar Sesión',
    signUp: 'Registrarse',
    signOut: 'Cerrar Sesión',
    login: 'Acceder',
    register: 'Registrar',
    password: 'Contraseña',
    confirmPassword: 'Confirmar Contraseña',
    forgotPassword: '¿Olvidaste tu contraseña?',
    createAccount: 'Crear Cuenta',
    welcomeToArcusHR: 'Bienvenido a ArcusHR',
    signInToAccount: 'Inicia sesión en tu cuenta',
    createCompany: 'Crear Empresa',
    
    // Employee Portal
    myProfile: 'Mi Perfil',
    myAttendance: 'Mi Asistencia',
    myLeaves: 'Mis Solicitudes de Permiso',
    myPayslips: 'Mis Recibos de Pago',
    employeePortal: 'Portal del Empleado',
    
    // Time
    hours: 'horas',
    days: 'días',
    today: 'Hoy',
    thisWeek: 'Esta Semana',
    thisMonth: 'Este Mes',
  }
} as const;

export type TranslationKey = keyof typeof translations.en;