import React from "react";
import { Box } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";

const float = keyframes`
  0%   { transform: translateY(0px) rotate(-1deg); }
  50%  { transform: translateY(-10px) rotate(1deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const glow = keyframes`
  0%   { box-shadow: 0 0 12px #00E676, 0 0 30px rgba(0,230,118,0.4); }
  50%  { box-shadow: 0 0 22px #00E676, 0 0 45px rgba(0,230,118,0.8); }
  100% { box-shadow: 0 0 12px #00E676, 0 0 30px rgba(0,230,118,0.4); }
`;


const grassPulse = keyframes`
  0%   { opacity: 0.12; }
  50%  { opacity: 0.3; }
  100% { opacity: 0.12; }
`;

const ballPath = keyframes`
  0%   { left: 14%; top: 58%; }
  18%  { left: 30%; top: 44%; }
  35%  { left: 50%; top: 50%; }
  55%  { left: 72%; top: 42%; }
  70%  { left: 86%; top: 52%; }
  80%  { left: 86%; top: 50%; }
  100% { left: 14%; top: 58%; }
`;

const spin = keyframes`
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(-360deg); }
`;

const goalLeftText = keyframes`
  0%   { opacity: 1; transform: translateY(-140%) scale(1.1); }
  8%   { opacity: 0; transform: translateY(-140%) scale(0.7); }
  90%  { opacity: 0; }
  100% { opacity: 1; transform: translateY(-140%) scale(1.1); }
`;

const goalRightText = keyframes`
  0%   { opacity: 0; transform: translateY(-140%) scale(0.7); }
  50%  { opacity: 0; }
  60%  { opacity: 1; transform: translateY(-140%) scale(1.15); }
  70%  { opacity: 1; transform: translateY(-140%) scale(1); }
  78%  { opacity: 0; transform: translateY(-140%) scale(0.7); }
  100% { opacity: 0; }
`;

const Field = styled("div")(({ theme }) => ({
    position: "relative",
    width: "100%",
    maxWidth: 420,
    aspectRatio: "4 / 3",
    borderRadius: 28,
    border: "2px solid #00E676",
    background:
        "radial-gradient(circle at top, rgba(0,230,118,0.25), rgba(0,0,0,0.85) 70%)",
    animation: `${float} 6s ease-in-out infinite alternate, ${glow} 3.8s ease-in-out infinite`,
    overflow: "hidden",
    marginInline: "auto",
    padding: theme.spacing(2.5),
}));

const GrassLayer = styled("div")(() => ({
    position: "absolute",
    inset: "7%",
    borderRadius: 22,
    backgroundImage:
        "repeating-linear-gradient(90deg, rgba(0, 230, 118, 0.14) 0, rgba(0, 230, 118, 0.14) 6px, rgba(0,0,0,0.65) 6px, rgba(0,0,0,0.65) 14px)",
    opacity: 0.18,
    mixBlendMode: "screen",
    pointerEvents: "none",
    animation: `${grassPulse} 5.5s ease-in-out infinite`,
}));

const SideLine = styled("div")(() => ({
    position: "absolute",
    top: "7%",
    bottom: "7%",
    left: "6%",
    right: "6%",
    borderRadius: 24,
    border: "1.6px solid rgba(255,255,255,0.28)",
}));

const CenterLine = styled("div")(() => ({
    position: "absolute",
    top: "10%",
    bottom: "10%",
    left: "50%",
    width: 2,
    transform: "translateX(-50%)",
    background: "rgba(255,255,255,0.4)",
}));

const CenterCircle = styled("div")(() => ({
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "32%",
    height: "32%",
    transform: "translate(-50%, -50%)",
    borderRadius: "50%",
    border: "1.6px solid rgba(255,255,255,0.32)",
}));

const BoxArea = styled("div")(() => ({
    position: "absolute",
    width: "22%",
    height: "40%",
    borderRadius: 18,
    border: "1.5px solid rgba(255,255,255,0.26)",
}));

const BallWrapper = styled("div")(() => ({
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: "50%",
    animation: `${ballPath} 5s cubic-bezier(0.65, 0, 0.35, 1) infinite`,
}));

const Ball = styled("div")(() => ({
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    background:
        "radial-gradient(circle at 30% 30%, #ffffff, #e0e0e0 40%, #bdbdbd 70%, #757575 100%)",
    boxShadow:
        "0 0 10px rgba(0,0,0,0.7), 0 0 18px rgba(0,230,118,0.7), 0 0 35px rgba(0,230,118,0.4)",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animation: `${spin} 2.8s linear infinite`,
}));

const BallPattern = styled("div")(() => ({
    width: "160%",
    height: "160%",
    backgroundImage:
        "radial-gradient(circle at 20% 20%, transparent 55%, rgba(0,0,0,0.65) 58%, transparent 63%), radial-gradient(circle at 70% 40%, transparent 55%, rgba(0,0,0,0.65) 58%, transparent 63%), radial-gradient(circle at 40% 80%, transparent 55%, rgba(0,0,0,0.65) 58%, transparent 63%)",
    opacity: 0.9,
}));

const GoalText = styled("div")(() => ({
    position: "absolute",
    color: "#00E676",
    fontWeight: 800,
    letterSpacing: "0.14em",
    textShadow:
        "0 0 10px rgba(0,230,118,0.9), 0 0 22px rgba(0,230,118,0.7), 0 0 40px rgba(0,230,118,0.6)",
    fontSize: 18,
}));

const GoalTextLeft = styled(GoalText)(() => ({
    left: "9%",
    top: "22%",
    animation: `${goalLeftText} 5s ease-in-out infinite`,
}));

const GoalTextRight = styled(GoalText)(() => ({
    right: "9%",
    top: "22%",
    animation: `${goalRightText} 5s ease-in-out infinite`,
}));

export const NeonFieldHeroVisual: React.FC = () => {
    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                px: { xs: 0, sm: 2 },
            }}
        >
            <Field>
                <GrassLayer />

                <SideLine />
                <CenterLine />
                <CenterCircle />

                <BoxArea
                    style={{
                        top: "50%",
                        left: "6%",
                        transform: "translateY(-50%)",
                        borderRadius: "18px 40px 40px 18px",
                    }}
                />
                <BoxArea
                    style={{
                        top: "50%",
                        right: "6%",
                        transform: "translateY(-50%)",
                        borderRadius: "40px 18px 18px 40px",
                    }}
                />

                <GoalTextLeft>GOOOL!</GoalTextLeft>
                <GoalTextRight>GOOOL!</GoalTextRight>

                <BallWrapper>
                    <Ball>
                        <BallPattern />
                    </Ball>
                </BallWrapper>
            </Field>
        </Box>
    );
};
