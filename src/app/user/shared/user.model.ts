export class UserModel {
  AspNetUserID: string = '';
  IsDelete: boolean = false;
  IsEdit: boolean = false;
  IsSuperUser: boolean = false;
  accountID: number = 0;
  accountName: string = '';
  confirmPassword: string = '';
  digestDayEnabled1: boolean = false;
  digestDayEnabled2: boolean = false;
  digestDayEnabled3: boolean = false;
  digestDayEnabled4: boolean = false;
  digestDayEnabled5: boolean = false;
  digestDayEnabled6: boolean = false;
  digestDayEnabled7: boolean = false;
  digestEnd: string = '';
  digestStart: string = '';
  disableAt: number= null;
  email: string = '';
  emailNotificationEnabled: boolean = false;
  firstName: string = '';
  imageName: string = '';
  imagePath: string = '';
  imageSource: number= null;
  imageType: number= null;
  invoiceDigestEnabled: boolean = false;
  lastName: string = '';
  mobileNumber: string = '';
  numberOfDigests: number = 0;
  password: string = '';
  selectedRoles: Array<any> = [];
  timeZone: string = '';
  type: string = '';
  userEmailNotifications: Array<any> = [];
  userID: number = 0;
  userName: string = '';
  workNumber: string = '';
}