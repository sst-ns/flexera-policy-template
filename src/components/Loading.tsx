import { Backdrop } from "@mui/material";

const Loading = () => {
  return (
    <Backdrop
      sx={{
        color: "white",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backdropFilter: "blur(5px)",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        pointerEvents: "none",
        overflow: "hidden",
      }}
      open
    >
      <img
        src="/animated-logo.gif"
        alt="Accenture - Let there be change"
        style={{
          width: "8rem",
          height: "8rem",
          maxWidth: "9rem",
          maxHeight: "9rem",
        }}
      />
    </Backdrop>
  );
};

export default Loading;
