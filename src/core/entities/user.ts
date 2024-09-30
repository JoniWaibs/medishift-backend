export class UserEntity<T> {
  constructor(readonly data: T) {}

  public changePassword(newPassword: string): void {
    console.log(newPassword);
  }
  
  public addRole(newRole: string): void {
    console.log(newRole);
  }
}
