document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const list = document.getElementById('todo-list');
    const remainingDisplay = document.getElementById('remaining-count');
    const emptyState = document.getElementById('empty-state');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let todos = JSON.parse(localStorage.getItem('zentasks')) || [];
    let currentFilter = 'all';

    const saveTodos = () => {
        localStorage.setItem('zentasks', JSON.stringify(todos));
        render();
    };

    const render = () => {
        list.innerHTML = '';
        
        const filteredTodos = todos.filter(todo => {
            if (currentFilter === 'active') return !todo.completed;
            if (currentFilter === 'completed') return todo.completed;
            return true;
        });

        if (filteredTodos.length === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
            filteredTodos.forEach(todo => {
                const li = document.createElement('li');
                li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
                
                li.innerHTML = `
                    <div class="checkbox ${todo.completed ? 'checked' : ''}" onclick="toggleTodo(${todo.id})"></div>
                    <span class="todo-text ${todo.completed ? 'completed' : ''}" 
                          contenteditable="true" 
                          onblur="editTodo(${todo.id}, this.innerText)">${todo.text}</span>
                    <button class="delete-btn" onclick="deleteTodo(${todo.id})">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5M10 11h4"></path></svg>
                    </button>
                `;
                list.appendChild(li);
            });
        }

        const activeCount = todos.filter(t => !t.completed).length;
        remainingDisplay.innerText = activeCount;
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (text) {
            todos.push({
                id: Date.now(),
                text: text,
                completed: false
            });
            input.value = '';
            saveTodos();
        }
    });

    window.toggleTodo = (id) => {
        todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
        saveTodos();
    };

    window.deleteTodo = (id) => {
        todos = todos.filter(t => t.id !== id);
        saveTodos();
    };

    window.editTodo = (id, newText) => {
        todos = todos.map(t => t.id === id ? { ...t, text: newText } : t);
        localStorage.setItem('zentasks', JSON.stringify(todos));
        // We don't call render() here to avoid losing focus while typing
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            render();
        });
    });

    render();
});