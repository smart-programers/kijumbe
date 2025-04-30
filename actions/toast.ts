import * as Burnt from "burnt";


type Preset = "done" | "error" | "none" | "custom";
export default function toast(title:string,preset:Preset,message:string,height:number=24,width:number=24,iconName:string="checkmark.seal",iconColor="#1D9BF0"){
 return preset!=="custom"? Burnt.toast({
    title:title,
     preset:preset,
    message:message, 
  }):
  Burnt.toast({
    title: title,
    preset: preset,
    message: message,
    layout: {
      iconSize: {
        height: 24,
        width: 24,
      },
    },
    icon: {
      ios: {
        // SF Symbol. For a full list, see https://developer.apple.com/sf-symbols/.
        name: iconName,
        color: iconColor,
      },
      // web: <Icon />,
    },
  });
}