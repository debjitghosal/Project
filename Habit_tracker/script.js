document.addEventListener('DOMContentLoaded', function () {
    const habitInput = document.getElementById('habit-name');
    const addHabitButton = document.getElementById('add-habit');
    const habitList = document.getElementById('habit-list');

    // Load habits from local storage on page load
    let habits = JSON.parse(localStorage.getItem('habits')) || [];

    // Function to render habits
    function renderHabits() {
        habitList.innerHTML = '';
        habits.forEach((habit, index) => {
            const habitElement = document.createElement('div');
            habitElement.classList.add('habit');
            if (habit.completed) {
                habitElement.classList.add('completed');
            }

            habitElement.innerHTML = `
                <span class="habit-name">${habit.name}</span>
                <span class="streak">Streak: ${habit.streak}</span>
                <button class="complete-btn" data-index="${index}">${habit.completed ? 'Undo' : 'Complete'}</button>
                <button class="remove-btn" data-index="${index}">Remove</button>
            `;
            habitList.appendChild(habitElement);
        });
    }

    // Function to toggle habit completion and update streak
    function toggleHabit(index) {
        const today = new Date().toLocaleDateString();
        const habit = habits[index];

        if (habit.lastCompletedDate === today) {
            // If toggling off completion on the same day
            habit.completed = false;
            habit.streak = habit.streak > 0 ? habit.streak - 1 : 0;
        } else {
            habit.completed = !habit.completed;
            if (habit.completed) {
                if (habit.lastCompletedDate) {
                    const lastCompleted = new Date(habit.lastCompletedDate);
                    const difference = Math.floor((new Date(today) - lastCompleted) / (1000 * 60 * 60 * 24));
                    habit.streak = difference === 1 ? habit.streak + 1 : 1;
                } else {
                    habit.streak = 1;
                }
            }
            habit.lastCompletedDate = today;
        }

        localStorage.setItem('habits', JSON.stringify(habits));
        renderHabits();
    }

    // Function to remove habit
    function removeHabit(index) {
        habits.splice(index, 1);
        localStorage.setItem('habits', JSON.stringify(habits));
        renderHabits();
    }

    // Add habit on button click
    addHabitButton.addEventListener('click', function () {
        const habitName = habitInput.value.trim();
        if (habitName !== '') {
            habits.push({ 
                name: habitName, 
                completed: false, 
                streak: 0, 
                lastCompletedDate: null 
            });
            localStorage.setItem('habits', JSON.stringify(habits));
            habitInput.value = '';
            renderHabits();
        }
    });

    // Handle complete/undo and remove button clicks
    habitList.addEventListener('click', function (event) {
        if (event.target.classList.contains('complete-btn')) {
            const index = event.target.getAttribute('data-index');
            toggleHabit(index);
        } else if (event.target.classList.contains('remove-btn')) {
            const index = event.target.getAttribute('data-index');
            removeHabit(index);
        }
    });

    // Render habits on page load
    renderHabits();
});
