// display user icon and online indicator

export default function Icon({userId,username,online}) {
  // blue, aqua, purple, pink, yellow, brown, salmon, beige, purple
    const colors = ['bg-[#749de3]',
                    'bg-[#7fc2cb]', 'bg-[#846BB1]',
                    'bg-[#ffc8f0]', 'bg-[#f2edae]',
                    'bg-[#b78757]', 'bg-[#FFA17A]', 'bg-[#F3EADA]', 'bg-[#AE5993]'];
    const userIdBase10 = parseInt(userId, 16);
    const colorIndex = userIdBase10 % (colors.length);
    const color = colors[colorIndex];
    return (
      <div className={"w-8 h-8 relative rounded-full flex items-center " + color}>
         <div className="text-[#1d1e1eab] text-center w-full ">{username[0]}</div>
         {online && (
          <div className="absolute w-3 h-3 bg-green-400 bottom-0 right-0 rounded-full border border-white"></div>
        )}
        {!online && (
          <div className="absolute w-3 h-3 bg-gray-400 bottom-0 right-0 rounded-full border border-white"></div>
        )} 
      </div>
    );
  }