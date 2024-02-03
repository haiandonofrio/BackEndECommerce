import { AdminManager } from "./userPermission/adminUser";
import { UserManager } from "./userPermission/normalUser";
import { PremiumManager } from "./userPermission/premuimUser";

export class RoleManager {

    static async determineAuthByRole(action, role) {
        const roleInstance = RoleManager.createRoleInstance(role);

        switch (action) {
            case 'CREATE':
                return roleInstance.create();
            case 'DELETE':
                return roleInstance.delete();
            case 'UPDATE':
                return roleInstance.update();
            default:
                return 'Invalid action';
        }


    }

    static createRoleInstance(role) {
        switch (role) {
            case 'USER':
                return new UserManager();
            case 'ADMIN':
                return new AdminManager();
            case 'PREMIUM':
                return new PremiumManager();
            default:
                throw new Error('Invalid role');
        }
    }
}