document.addEventListener("DOMContentLoaded", function(){

    const searchButton = document.getElementById("search-btn")
    const usernameInput = document.getElementById("user-input")
    const statsContainer = document.querySelector(".stat-container")
    const easyProgress = document.querySelector(".easy-progress")
    const mediumProgress = document.querySelector(".medium-progress")
    const hardProgress = document.querySelector(".hard-progress")
    const easyLabel = document.getElementById("easy-label")
    const mediumLabel = document.getElementById("medium-label")
    const hardLabel = document.getElementById("hard-label")
    const statsCard = document.querySelector(".stats-card")

    //validating entered username
    function validUsername(username){
        // Check if the username is empty
        if(username.trim() === ""){
            console.log("Username cannot be left blank. Please enter a valid username.");
            return false; 
        }
        //Check if the username matches the regex pattern
        const regex = /^[a-zA-Z0-9_-]{1,15}$/
        if(!regex.test(username)){
            console.log("Invalid username. Please enter a valid username.");
            return false;
        } 
        return true;
    }
    
    //fetching user metrics through API
    async function fetchUserMetrics(username){
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
        try{

            searchButton.textContent = "Searching";
            searchButton.disabled = true;
            statsContainer.classList.add("hidden")

            // Fetch data from the server
            const response = await fetch(url)
            // Check if the response is successful
            if(response.ok){
                let data = await response.json();
                // Check if the user exists in the data
                if(data.status === 'error' && data.message === 'user does not exist'){
                    console.log(data);
                    alert("User does not exist. Please enter a valid username.")
                    
                } else{
                    console.log("User data:", data);
                    displayUserData(data)
                }
            } else{
                throw new Error('Network response was not ok.');
                
            }
        } catch(error){
            console.error(error);
        } finally{
            searchButton.textContent = "Search";
            searchButton.disabled = false;
            usernameInput.value = ""
        }

        
    }

    function updateProgress(solved, total, label, circle){
        const progressDegree = (solved/total)*100
        circle.style.setProperty("--progress-degree", `${progressDegree}%`)
        label.textContent = `${solved}/${total}`
    }

    // displaying user data 
    function displayUserData(data){
        const totalQues = data.totalQuestions
        const totalEasyQues = data.totalEasy
        const totalMediumQues = data.totalMedium
        const totalHardQues = data.totalHard

        const solvedTotal = data.totalSolved
        const solvedEasy = data.easySolved
        const solvedMedium = data.mediumSolved
        const solvedHard = data.hardSolved

        updateProgress(solvedEasy, totalEasyQues, easyLabel, easyProgress)
        updateProgress(solvedMedium, totalMediumQues, mediumLabel, mediumProgress)
        updateProgress(solvedHard, totalHardQues, hardLabel, hardProgress)

        const cardsData = [
            {label: "Total Solved Questions", value: data.solvedTotal},
            {label: "Acceptance Rate", value: data.acceptanceRate},
            {label: "Ranking", value: data.ranking},
            {label: "Contribution Points", value: data.contributionPoints}
        ]
        console.log(cardsData);
        statsCard.innerHTML = cardsData.map(data=>{
            return `<div class= "card">
                    <h3>${data.label}</h3>
                    <p>${data.value}</p>
                </div>`
        }).join("")
    }

    //getting username entered in inputbox
    searchButton.addEventListener('click', ()=>{
        const username = usernameInput.value;
        console.log("username: ", username);
        if(validUsername(username)){
            console.log("matched username");
            fetchUserMetrics(username);
        }
    })


})


