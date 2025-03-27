import { fetchAssignListService } from "../services/AssignService";

export const getCurrentRole = () => {
    return localStorage.getItem("role")
}

export const isValidRole = (role) => {
    return role === getCurrentRole();
}

export const isProjectMember = async (email, id) => {
    if (isValidRole("ROLE_ADMIN")) return true;

    try {
        const response = await fetchAssignListService({ id });
        const assigns = response.content || [];
        const listMember = assigns.map((assign) => ({
            email: assign.accountDTO.email,
        }));
        // Check if the email exists in the listMember array
        const emailExists = listMember.some(member => member.email === email);

        return emailExists;
    } catch (error) {
        console.error(error);
        return false; // or handle it as you see fit
    }
};