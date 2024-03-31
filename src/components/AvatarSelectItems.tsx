import {  SelectItem } from "@/components/ui/select";
import {  Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Avatar {
    value: string;
    src: string;
    alt: string;
  }

export const AvatarSelectItems = () => {

    const avatars:Avatar[]= [
        { value: 'avatar1', src: '../src/assets/1.png', alt: 'avatar1' },
        { value: 'avatar2', src: '../src/assets/2.png', alt: 'avatar2' },
        { value: 'avatar3', src: '../src/assets/3.png', alt: 'avatar3' },
        { value: 'avatar4', src: '../src/assets/4.png', alt: 'avatar4' },
        { value: 'avatar5', src: '../src/assets/5.png', alt: 'avatar5' },
        { value: 'avatar6', src: '../src/assets/6.png', alt: 'avatar6' },
        { value: 'avatar7', src: '../src/assets/7.png', alt: 'avatar7' },
        { value: 'avatar8', src: '../src/assets/8.png', alt: 'avatar8' },
        { value: 'avatar9', src: '../src/assets/9.png', alt: 'avatar9' },
        // { value: 'X', src:'', alt:'default' },
        
      ];
  return (
    <>
    {avatars.map((avatar) => (
      <SelectItem key={avatar.value} value={avatar.src}>
        <Avatar>
          <AvatarImage src={avatar.src} alt={avatar.alt} />
          <AvatarFallback>X</AvatarFallback>
        </Avatar>
      </SelectItem>
    ))}
  </>
  )
}
