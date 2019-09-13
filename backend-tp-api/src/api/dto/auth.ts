interface AuthRequest {
    username : string ;
    password : string ;
    roles : string ;
}

interface AuthResponse {
    username : string ;
    status : boolean ;
    message : string ;
    token : string ;
    roles : string ;
}