import Image from 'next/image';

const BtnHexagon2 = ({ disabled, onClick}) => {
  return (
    <button
      onClick={onClick}
      className={`relative flex w-full items-center justify-center ${
        disabled ? 'pointer-events-none' : ''
      }`}
    >
      <Image
        src={
          !disabled
            ? '/btn-send.png'
            : '/btn-send-disable.png'
        }
        width={820}
        height={192}
        alt='Zirolu'
        priority
      />
    </button>
  );
};

export default BtnHexagon2;
