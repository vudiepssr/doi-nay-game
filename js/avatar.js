export function getAvatar(player){
  if(player.age<3) return '👶';
  if(player.age<13) return player.gender==='Nữ'?'👧':'👦';
  if(player.age<18) return player.gender==='Nữ'?'👩':'🧑';
  if(player.age>=75) return player.gender==='Nữ'?'👵':'👴';
  if(player.age>=50) return player.gender==='Nữ'?'👩‍🦳':'👨‍🦳';
  if(player.health<25) return '🤕';
  if(player.wealth>90 && player.cash>1e9) return '🤑';
  if(player.happiness>78) return '😎';
  return player.gender==='Nữ'?'👩‍💻':'🧑‍💻';
}
