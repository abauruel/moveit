import {createContext, useState, ReactNode, useEffect } from 'react'
import Cookies from 'js-cookie'
import challenges from '../../challenges.json'
import { LevelUpModal } from '../components/LevelUpModal'

type ChallengesProviderProps = {
  children: ReactNode;
    level: number,
    currentExperience: number,
    challengesCompleted:  number
  }


type Challenge = {
  type: 'body'| 'eye',
  description: string,
  amount: number,
}

type ChallengesContextData ={
  level: number;
  currentExperience: number;
  challengesCompleted: number;
  activeChallenge: Challenge; 
  experienceToNextLevel: number;
  levelUp: ()=>void;
  startNewChallenge: ()=>void;
  resetChallenge: ()=> void;
  completeChallenge:()=>void
  closeLevelUpModal: ()=>void
}

export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({children, ...rest}: ChallengesProviderProps) {
  const [level, setLevel] = useState(rest.level ?? 1)
  const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0)
  const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted ?? 0)
 
  const [activeChallenge, setActiveChallenge] = useState(null)
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false)
  //calculo de level usado em rpg's
  const experienceToNextLevel = Math.pow((level + 1) * 4, 2)

  useEffect(()=>{
    Notification.requestPermission()
  },[])
  
  function levelUp() {
      setLevel(level + 1)
      setIsLevelModalOpen(true)
  }
 function closeLevelUpModal(){
   setIsLevelModalOpen(false)
 }

  function startNewChallenge(){
    const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
    const challenge = challenges[randomChallengeIndex]
    setActiveChallenge( challenge )

    new Audio('/notification.mp3').play()

    if( Notification.permission === 'granted'){
      new Notification('Novo desafio', {
        body: `Valendo ${challenge.amount}xp!`
      })
    }
  }

  function resetChallenge(){
    setActiveChallenge(null)
  }

  function completeChallenge(){
    if(!activeChallenge)return

    const {amount} = activeChallenge

    let finalExperience = currentExperience + amount
    if(finalExperience >= experienceToNextLevel){
      finalExperience = finalExperience - experienceToNextLevel
      levelUp()
    }

    setCurrentExperience(finalExperience)
    setActiveChallenge(null)
    setChallengesCompleted(challengesCompleted + 1)
  }

  useEffect(()=>{
    Cookies.set('level', String(level))
    Cookies.set('currentExperience', String(currentExperience))
    Cookies.set('challengesCompleted', String(challengesCompleted))
  },[level, currentExperience, challengesCompleted])

  return (
   <ChallengesContext.Provider 
   value={{ 
     level, 
     levelUp, 
     currentExperience, 
     challengesCompleted,
     activeChallenge,
     experienceToNextLevel,
     startNewChallenge,
     resetChallenge,
     completeChallenge,
     closeLevelUpModal
     }}>
   { children }
   {isLevelModalOpen && <LevelUpModal /> }
   
   </ChallengesContext.Provider>
  )
}