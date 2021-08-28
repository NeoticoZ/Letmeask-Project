import { useState } from 'react';
import { FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';

import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button';
import { database } from '../services/firebase';

import '../styles/auth.scss';

export function NewRoom() {
  const { user } = useAuth();

  const history = useHistory();

  const [ newRoom, setNewRoom ] = useState('');

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    if (newRoom.trim() === '') {
      return;
    }

    // cria uma categoria chamada rooms
    const roomRef = database.ref('rooms');

    // espera a categoria ser criada e envia o objeto com os valores
    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id
    })

    /*
    redireciona o usuário para a sala criada, onde o firebaseRoom.key retorna
    o id da sala
    */
    history.push(`/rooms/${firebaseRoom.key}`);
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
          <h2>Criar uma nova sala</h2>
          <form onSubmit={ handleCreateRoom }>
            <input 
              type="text"
              placeholder="Nome da sala" 
              onChange={event => setNewRoom(event.target.value)}
              value={ newRoom }
            />
            <Button type="submit">
              Criar sala
            </Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
}