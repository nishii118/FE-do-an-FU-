// ProjectContext.js
import React, { createContext, useState } from 'react';

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
    const [projectData, setProjectData] = useState({
        title: "",
        campaign: null,
        address: "",
        ward: "",
        district: "",
        province: "",
        background: "",
        constructions: [],
        imageURLs: [],
        initialImageURLs: [],
        images: [],
        fileURLs: [],
        initialFileURLs: [],
        files: [],
        budgets: [],
        assign: [],
        totalBudget: 0,
        totalSponsorship: 0,
    });

    return (
        <ProjectContext.Provider value={{ projectData, setProjectData }}>
            {children}
        </ProjectContext.Provider>
    );
};
