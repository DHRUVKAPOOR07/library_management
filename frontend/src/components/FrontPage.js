import React, { useState } from "react";
import { Box, Typography, Grid, Paper, Dialog, DialogActions, DialogContent, DialogTitle, Fade } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Signin from "./Signin";
import SigninPopup from "./SigninPopup";
import Button from '@mui/material/Button';
import DialogContentText from '@mui/material/DialogContentText';
import Draggable from 'react-draggable';
// import { Sign } from "crypto";

const FrontPage = () => {
    function PaperComponent(props) {
        const nodeRef = React.useRef(null);
        return (
          <Draggable
            nodeRef={nodeRef}
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
          >
            <Paper {...props} ref={nodeRef} />
          </Draggable>
        );
      }
      const shakeEffect = {
        animation: "shake 0.5s ease-in-out infinite",
      };
      const shakeAnimation = `
  @keyframes shake {
    0% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    50% { transform: translateX(5px); }
    75% { transform: translateX(-5px); }
    100% { transform: translateX(0); }
  }
`;

      const [open, setOpen] = React.useState(false);

      const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
          
      const [shake, setShake] = React.useState(false);
      const handleShake = () => {
        setShake(true);
        setTimeout(() => {
          setShake(false);  // Reset the shake after animation
        }, 500);
      };
    

  return (
    <Box
      sx={{
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: "#f9f9f9",
        overflowX: "hidden",
      }}
    >
      {/* Header Section with Parallax */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
          color: "white",
          textAlign: "center",
          padding: { xs: "40px 20px", sm: "80px 20px" },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            zIndex: 1,
            textShadow: "2px 2px 6px rgba(0,0,0,0.5)",
            "@media (max-width:600px)": { fontSize: "2.5rem" },
          }}
        >
          Welcome to the Library Management System
        </Typography>
        <Typography
          variant="h6"
          sx={{
            marginTop: "20px",
            opacity: 0.9,
            zIndex: 1,
          }}
        >
          Streamlining your library journey with innovative tools.
        </Typography>
        <React.Fragment>
        <style>{shakeAnimation}</style>
        <Button
          variant="Filled"
          style={{
            backgroundColor: "white",
            color: "black",
            marginTop: "50px",
            animation: "shake 0.5s ease-in-out infinite",  // Apply the shake animation
          }}
          onClick={handleClickOpen}
        >
          Get Started
        </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          Subscribe
        </DialogTitle>
        <DialogContent >
          <DialogContentText >
            <Signin></Signin>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
      </Box>

      {/* Dialog for Get Started */}
      <Dialog open={open} onClose={handleClose}>
        {/* <DialogTitle>Welcome to the Library Management System</DialogTitle> */}
        <DialogContent >
          <SigninPopup/>
        </DialogContent>
      
      </Dialog>

      {/* About Section */}
      <Box sx={{ padding: "60px 20px", textAlign: "center" }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            marginBottom: "30px",
            position: "relative",
            "&::after": {
              content: '""',
              display: "block",
              width: "60px",
              height: "4px",
              backgroundColor: "#3b82f6",
              margin: "10px auto",
            },
          }}
        >
          About Our System
        </Typography>
        <Typography
          variant="body1"
          sx={{
            margin: "0 auto",
            maxWidth: "800px",
            lineHeight: 1.8,
            fontSize: "1.2rem",
          }}
        >
          Our Library Management System revolutionizes book borrowing and
          management. Tailored for students, teachers, and avid readers, the
          platform simplifies every interaction.
        </Typography>
        <img
          src="https://www.skoolbeep.com/blog/wp-content/uploads/2020/12/WHAT-IS-THE-PURPOSE-OF-A-LIBRARY-MANAGEMENT-SYSTEM-min.png"
          alt="Library Management"
          style={{
            maxWidth: "100%",
            marginTop: "40px",
            borderRadius: "15px",
            boxShadow: "0px 8px 20px rgba(0,0,0,0.3)",
          }}
        />
      </Box>

      {/* Features Section */}
      <Box sx={{ padding: "60px 20px", backgroundColor: "#f0f8ff" }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            marginBottom: "40px",
            textAlign: "center",
            position: "relative",
            "&::after": {
              content: '""',
              display: "block",
              width: "60px",
              height: "4px",
              backgroundColor: "#06b6d4",
              margin: "10px auto",
            },
          }}
        >
          Key Features
        </Typography>
        <Grid container spacing={4}>
          {[
            {
              title: "Borrow Books",
              description: "Seamless book borrowing and request tracking.",
              icon: "📚",
            },
            {
              title: "Analytics Dashboard",
              description: "Visualize your activity with stunning dashboards.",
              icon: "📊",
            },
            {
              title: "Secure Access",
              description: "Protected accounts with advanced security layers.",
              icon: "🔒",
            },
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={6}
                sx={{
                  padding: "20px",
                  textAlign: "center",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0px 12px 30px rgba(0,0,0,0.3)",
                  },
                }}
              >
                <Typography variant="h5" sx={{ fontSize: "3rem", marginBottom: "10px" }}>
                  {feature.icon}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ padding: "60px 20px", backgroundColor: "#ffffff" }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            marginBottom: "30px",
            textAlign: "center",
            position: "relative",
            "&::after": {
              content: '""',
              display: "block",
              width: "60px",
              height: "4px",
              backgroundColor: "#3b82f6",
              margin: "10px auto",
            },
          }}
        >
          What Our Users Say
        </Typography>
        <Swiper spaceBetween={30} slidesPerView={1}>
          {[
            {
              name: "Test7",
              feedback:
                "The system is incredibly intuitive and has streamlined our book borrowing process!",
            },
            {
              name: "Test3",
              feedback:
                "A game-changer for students. The dashboard and analytics are top-notch!",
            },
          ].map((testimonial, index) => (
            <SwiperSlide key={index}>
              <Paper
                elevation={4}
                sx={{
                  padding: "30px",
                  maxWidth: "600px",
                  margin: "0 auto",
                  textAlign: "center",
                  boxShadow: "0px 8px 20px rgba(0,0,0,0.2)",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ fontStyle: "italic", marginBottom: "20px" }}
                >
                  "{testimonial.feedback}"
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  - {testimonial.name}
                </Typography>
              </Paper>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      {/* Footer Section */}
      <Box
        sx={{
          backgroundColor: "#3b82f6",
          color: "white",
          padding: "20px 10px",
          textAlign: "center",
        }}
      >
        <Typography variant="body2">
          &copy; {new Date().getFullYear()} Library Management System. All Rights
          Reserved.
        </Typography>
        <Typography variant="body2" sx={{ marginTop: "10px" }}>
          Need help?{" "}
          <a href="/contact" style={{ color: "#e0f7fa" }}>
            Contact Us
          </a>
        </Typography>
      </Box>
    </Box>
  );
};

export default FrontPage;
