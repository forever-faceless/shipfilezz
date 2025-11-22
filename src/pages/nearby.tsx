import Model from "@/components/Model";

const NearBy = () => {
  return (
    <div
      className="
relative min-h-screen w-full 
flex items-center justify-center
bg-cover bg-no-repeat bg-left md:bg-center
"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/du0gsc1fv/image/upload/v1763724105/background_j3lapz.png')",
      }}
    >
      {" "}
      <Model />
    </div>
  );
};

export default NearBy;
