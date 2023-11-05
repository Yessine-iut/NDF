import React, { useState } from "react";

import FormulaireStep1 from "./RegisterStep1";
import FormulaireStep2 from "./RegisterStep2";
import FormulaireStep3 from "./RegisterStep3";
import FormulaireStep4 from "./RegisterStep4";


function FormulaireRegister() {
    const [step, setstep] = useState(1);
    const [inputList, setInputList] = useState([]);

    const [formData, setFormData] = useState({
        complementVoie:"",
        services:""
    })

    const nextStep = () => {
        setstep(step + 1);
    };

    const prevStep = () => {
        setstep(step - 1);
    };

    const handleInputData = input => e => {
        const { value } = e.target;

        setFormData(prevState => ({
            ...prevState,
            [input]: value
        }));
    }

    switch (step) {
        case 1:
            return (
                <FormulaireStep1
                    nextStep={nextStep} handleFormData={handleInputData} values={formData} />
            );
        case 2:
            return (
                <FormulaireStep2 inputList={inputList} setInputList={setInputList}
                    nextStep={nextStep} prevStep={prevStep} handleFormData={handleInputData} values={formData} />
            );
        case 3:
            return (
                <FormulaireStep3
                    nextStep={nextStep} prevStep={prevStep} handleFormData={handleInputData} values={formData} />
            );
        case 4:
            return (
                <FormulaireStep4 prevStep={prevStep} handleFormData={handleInputData} values={formData} />
            );
        default:
            return (<></>);

    }
}

export default FormulaireRegister;