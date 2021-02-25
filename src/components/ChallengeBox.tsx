import { useContext } from 'react'
import { ChallengesContext } from '../contexts/ChallengesContext'
import { CountDownContext } from '../contexts/CountDownContext'
import styles from '../styles/components/ChallengeBox.module.css'
export function ChallengeBox(){
    const { activeChallenge, resetChallenge, completeChallenge} = useContext(ChallengesContext)
    const { resetCountDown } = useContext(CountDownContext)
    
    function handleChallengeSucceded(){
        completeChallenge()
        resetCountDown()
    }

  function handleChallengeFailed(){
    resetCountDown()
    resetChallenge()
  }

    return(
        <div className={styles.challengeBoxContainer}>
           { activeChallenge ? (
               <div className={styles.challengeActive}>
                   <header>Ganhe {activeChallenge.amount}xp</header>
                   <main>
                       <img src={`icons/${activeChallenge.type}.svg`} alt=""/>
                       <strong>Novo desafio</strong>
                        <p>{activeChallenge.description}</p>
                   </main>
                   <footer>
                       <button 
                        className={styles.challengeFailedButton} 
                        onClick={handleChallengeFailed}>Falhei</button>
                       <button 
                        className={styles.challengeSucceededButton} 
                        onClick={handleChallengeSucceded}>Completei</button>
                     
                   </footer>
               </div>
           ) : (
                <div className={styles.challengeIsNotActive}>
                    <strong>Finalize um ciclo para receber um desafio</strong>
                    <p>
                        <img src="icons/level-up.svg" alt="Level Up"/>
                        Avance de level completando desafios.
                    </p>
                </div>
           )}

        </div>
    )
}