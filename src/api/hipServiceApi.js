import axios from 'axios';
import * as Constants from './constants';
export const getAuthModes = async (healthId) => {
    let error = isValidHealthId(healthId);
    if (error) {
        return error;
    }
    const data = {
        "healthId": healthId,
        "purpose": Constants.purpose
    };

    try {
        const response = await axios.post(Constants.hipServiceUrl + Constants.authModesUrl, data, Constants.headers);
        return response.data;
    }
    catch (error) {
        if (error.response !== undefined)
            return error.response.data;
        else
            return Constants.serviceUnavailableError;
    }
};

export const saveDemographics = async (healthId,ndhmDetails) => {
    const data = {
            "healthId": healthId,
            "name": ndhmDetails.name,
            "gender": ndhmDetails.gender,
            "dateOfBirth": ndhmDetails.dateOfBirth,
            "phoneNumber": ndhmDetails.identifiers[0].value
    };

    try {
        const response = await axios.post(Constants.hipServiceUrl + Constants.ndhmDemographics, data, Constants.headers);
        return response.data;
    }
    catch (error) {
        if (error.response !== undefined)
            return error.response.data;
        else
            return Constants.serviceUnavailableError;
    }
};

export const authInit = async (healthId, authMode) => {
    let error = isValidAuthMode(authMode);
    if (error)
        return error;
    const data = {
        "healthId": healthId,
        "authMode": authMode,
        "purpose": Constants.purpose
    };
    try {
        const response = await axios.post(Constants.hipServiceUrl + Constants.authInitUrl, data, Constants.headers);
        return response;
    }
    catch (error) {
        if (error.response !== undefined)
            return error.response.data;
        else
            return Constants.serviceUnavailableError;
    }
};

export const authConfirm = async (healthId, otp) => {
    let error = isValidOTP(otp);
    if (error) {
        return error;
    }
    const data = {
        "authCode": btoa(otp),
        "healthId": healthId
    };
    try {
        const response = await axios.post(Constants.hipServiceUrl + Constants.authConfirmUrl, data, Constants.headers);
        return response.data.patient;
    }
    catch (error) {
        if (error.response !== undefined)
            return error.response.data;
        else
            return Constants.serviceUnavailableError;
    }
}

export const fetchPatientDetailsFromBahmni = async (patient) => {
    const params = {
        "patientName": patient.name,
        "patientYearOfBirth": new Date(patient.dateOfBirth).getFullYear(),
        "patientGender": patient.gender,
        "phoneNumber": encodeURI(patient.identifiers[0].value)
    }
    try {
        const response = await axios.get(Constants.bahmniUrl + Constants.existingPatientUrl, { params }, Constants.headers);
        return response.data;
    }
    catch (error) {
        if (error.response !== undefined)
            return error.response.data;
        else
            return Constants.serviceUnavailableError;
    }
}

const isValidHealthId = (healthId) => {
    if (!(IsValidPHRAddress(healthId) || IsValidHealthId(healthId)))
        return Constants.invalidHealthId;
}

const isValidAuthMode = (authMode) => {
    if (authMode === '')
        return Constants.invalidAuthMode;
}

const isValidOTP = (otp) => {
    if (otp === '')
        return Constants.emptyOTP;
}

export const fetchPatientFromBahmniWithHealthId = async (healthId) => {
    try {
        const response = await axios.get(Constants.bahmniUrl + Constants.existingPatientUrl + "/" + healthId, Constants.headers);
        return response.data;
    } catch (error) {
        return Constants.openMrsDown;
    }
}

export const getHealthIdStatus = async (patientUuid) => {
    try {
        const response = await axios.get(Constants.bahmniUrl + Constants.existingPatientUrl + "/IdDeactivationStatus/" + patientUuid, Constants.headers);
        return response.data;
    } catch (error) {
        return Constants.openMrsDown;
    }
}
const IsValidPHRAddress = (healthId) => {
    let pattern = "^[a-zA-Z]+(([a-zA-Z.0-9]+){2})[a-zA-Z0-9]+@[a-zA-Z]+$";
    return healthId.match(pattern);
}

const IsValidHealthId = (healthId) => {
    let pattern = "^([0-9]{14})$|^[0-9]{2}[-][0-9]{4}[-][0-9]{4}[-][0-9]{4}$";
    return healthId.match(pattern);
}

export const getPatientQueue = async () => {
    try {
        const response = await axios.get(Constants.hipServiceUrl + Constants.patientProfileFetch);
        return response.data;
    }
    catch (error) {
        if (error.response !== undefined)
            return error.response.data;
        else
            return Constants.serviceUnavailableError;
    }
};

export const saveTokenOnQRScan = async (ndhmDetails) => {
    const data = {
        "healthId": ndhmDetails.id,
        "name": ndhmDetails.name,
        "gender": ndhmDetails.gender,
        "dateOfBirth": ndhmDetails.dateOfBirth,
        "phoneNumber": ndhmDetails.identifiers[0].value
    };
    try {
        const response = await axios.post(Constants.hipServiceUrl + Constants.authToken,data, Constants.headers);
        return response;
    }
    catch (error) {
        return Constants.serviceUnavailableError;
    }
};


