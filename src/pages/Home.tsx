import { useHistory } from 'react-router-dom';
import { useState, FormEvent } from 'react';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import { Button } from '../components/Button';

import '../styles/auth.scss';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();
  const [ roomCode, setRoomCode ] = useState('');

  async function handleCreateRoom() {
    if(!user) {
      await signInWithGoogle();
    }

    history.push('/rooms/new');
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    // remove os espaços e verifica se o value é null
    if (roomCode.trim() === '') {
      return;
    }

    // manda um get utilizando a key passada no estado roomCode
    const roomRef = await database.ref(`rooms/${ roomCode }`).get();

    // verifica se a sala existe, se não, retorna um alert
    if (!roomRef.exists()) {
      alert('Room does not exists.');
      return;
    }

    // se tudo der certo, o usuário será redirecionado para a sala
    history.push(`/rooms/${ roomCode }`);
  }

  return (
    <div id="pages-auth">
      <aside>
        <img src={ illustrationImg } alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={ logoImg } alt="Letmeask" />
          <button className="create-room" onClick={handleCreateRoom}>
            <img src={ googleIconImg } alt="Logo do Google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">
            ou entre em uma sala
          </div>
          <form onSubmit={ handleJoinRoom }>
            <input 
              type="text"
              placeholder="Digite o código da sala" 
              onChange={ event => setRoomCode(event.target.value) }
              value={ roomCode }
            />
            <Button type="submit">
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}