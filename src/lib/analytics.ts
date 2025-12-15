import ReactGA from "react-ga4";

// Replace with your actual Measurement ID
const GA_MEASUREMENT_ID = "G-XXXXXXXXXX";

export const initGA = () => {
    ReactGA.initialize(GA_MEASUREMENT_ID);
};

export const logPageView = () => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
};

export const logEvent = (category: string, action: string, label?: string) => {
    ReactGA.event({
        category: category,
        action: action,
        label: label,
    });
};
