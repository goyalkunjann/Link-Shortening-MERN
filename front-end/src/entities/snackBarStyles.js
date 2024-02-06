const getSnackBarStyles = (isError = false) => {
    return {
        container: [
            ["background", [isError ? "red" : "#00ff93"]],
            ["border", "1px solid #000000"],
            ["border-radius", "4px"],
            ["box-shadow", "4px 4px 0px #000000"],
            ["color", "black"],
        ],
    };
};

export default getSnackBarStyles;