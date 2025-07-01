export interface HospitalInfo {
    id: number
    name: string
    address: string
    phone: string
    email: string
    logoPath: string
  }
  
  export interface CreateHospitalInfoRequest {
    name?: string
    address?: string
    phone?: string
    email?: string
    logo?: File
  }
  
  export interface UpdateHospitalInfoRequest {
    name?: string
    address?: string
    phone?: string
    email?: string
    logo?: File
  }
  
  export interface ApiResponse<T> {
    message: string
    data: T
  }
  