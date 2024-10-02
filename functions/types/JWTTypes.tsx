export interface Token {
  // issuer
  iss: string | undefined;
  // issued at (seconds since Unix epoch)
  iat: number | undefined;
  // not valid before (seconds since Unix epoch)
  nbf: number | undefined;
  // expiration time (seconds since Unix epoch)
  exp: number | undefined;
  // Collider
  app_displayname: string | undefined;
  // Collider id
  appid: string | undefined;
  // Del Castillo Baquero
  family_name: string | undefined;
  // Joel
  given_name: string | undefined;
  // IP Address
  ipaddr: string | undefined;
  // Joel Del Castillo Baquero
  name: string | undefined;
  // 77ef-be73-4f4asd8-b860-3508a0e647c6
  oid: string | undefined;

  tenant_region_scope: string | undefined;

  // jdelcastillo@estud.usfq.edu.ec
  unique_name: string | undefined;
  // jdelcastillo@estud.usfq.edu.ec
  upn: string | undefined;
}
