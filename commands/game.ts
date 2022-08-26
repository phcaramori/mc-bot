import  { EmbedBuilder , SlashCommandBuilder , ActionRowBuilder , ButtonBuilder , ButtonStyle } from 'discord.js';
import * as PF from 'pathfinding'
import * as fs from 'fs'


/* TODO:
    - add better state storage system that supports multiple players. (read message using interaction.fetchReply())
        - this will make it so multiple games can be active at once
    - add moving obstacles
*/
export default{
    data: new SlashCommandBuilder()
        .setName("game")
        .setDescription("Work in progress game")
    ,
    command: async function (interaction){
        let gameBoard = [];
        let matrixForPathfinding = [];
        let userPosX = 0;
        let userPosY = 0;
        let randGoal1;
        let randGoal2;
        let row = new ActionRowBuilder()
			row.addComponents(
				new ButtonBuilder()
					.setCustomId('up')
					.setLabel('⬆️')
					.setStyle(ButtonStyle.Secondary),
			)
            row.addComponents(
				new ButtonBuilder()
					.setCustomId('right')
					.setLabel('➡️')
					.setStyle(ButtonStyle.Secondary),
			)
            row.addComponents(
				new ButtonBuilder()
					.setCustomId('down')
					.setLabel('⬇️')
					.setStyle(ButtonStyle.Secondary),
			)
            row.addComponents(
				new ButtonBuilder()
					.setCustomId('left')
					.setLabel('⬅️')
					.setStyle(ButtonStyle.Secondary),
			);

        let updateStoredGrid = function(){ //temporary solution to state storage
            fs.writeFileSync('./json/game.json',JSON.stringify({game: gameBoard, userPosX: userPosX, userPosY: userPosY}))
        }

        let makeBoardString = function(){
            let line = '';
            for(let i = 0; i < 7; i++){
                line = line + gameBoard[i].join(' ') + ' \n ';
            }
            return line;
        }

        let createGrid = async function(){
            gameBoard = []
            for(let i = 0; i < 7; i++){
                let temp = [];
                let tempMatrix = [];
                for(let k = 0; k < 7; k++){
                    temp.push('◼️')
                    tempMatrix.push(0)
                }
                gameBoard.push(temp)
                matrixForPathfinding.push(tempMatrix)
            }

            //load Random Obstacles
            for(let i = 0; i < 7; i++){
                for(let k = 0; k < 7; k++){
                    if(Math.floor(Math.random() * 5) == 0){
                        if (Math.floor(Math.random() * 20) == 0 && i<6){
                            gameBoard[i+1][k] = '◻️';
                            gameBoard[i][k] = '◻️';
                            matrixForPathfinding[i+1][k] = 1
                            matrixForPathfinding[i][k] = 1
                        }else{
                            gameBoard[i][k] = '◻️'
                            matrixForPathfinding[i][k] = 1
                        } 
                    } 
                }
            }

            //place goals
            gameBoard[0][0] = '🟧'
            let validPositionForGoal = false
            while(!validPositionForGoal){
                randGoal1 = Math.floor(Math.random() * 7)
                randGoal2 = Math.floor(Math.random() * 7)
                if(randGoal1 != 0 && randGoal2 != 0){
                    gameBoard[randGoal1][randGoal2] = '🟩';
                    validPositionForGoal = true;
                }
            }
            let grid = new PF.Grid(matrixForPathfinding)
            let finder = new PF.BestFirstFinder();
            let path = finder.findPath(0, 0, randGoal1, randGoal2, grid);
            if(path.length === 0){
                createGrid()
            }else{
                let embed = new EmbedBuilder()
                let content = makeBoardString()
                embed.addFields({name: 'Game Board:', value: content})
                interaction.reply({ embeds: [embed], components: [row] })
            }
            
        }

        let updateGrid = function (interaction){
            let JSONgrid = fs.readFileSync('./json/game.json');
            let parsed = JSON.parse(JSONgrid.toString())
            gameBoard = parsed.game;
            userPosX = parsed.userPosX;
            userPosY = parsed.userPosY;
            let embed = new EmbedBuilder()

            gameBoard[userPosY][userPosX] = '◼️' //delete previous position
            if(interaction.customId == 'up')
                userPosY --; 
            else if(interaction.customId == 'right'){
                userPosX ++;
            }else if(interaction.customId == 'down'){
                userPosY ++;
            }else if(interaction.customId == 'left'){
                userPosX --;
            }
            if(gameBoard[userPosY][userPosX] == '🟩'){
                embed.setTitle("Congratulations! You win!")
                interaction.update({ embeds: [embed], components: [] })
                return;
            }else if(gameBoard[userPosY][userPosX] == '◻️'){
                embed.setTitle("You loose :(")
                interaction.update({ embeds: [embed], components: [] })
                return;
            }
            gameBoard[userPosY][userPosX] = '🟧' // set new position
            let content = makeBoardString()
            embed.addFields({name: 'Game Board:', value: content})
            interaction.update({ embeds: [embed], components: [row] })
        }


        if(interaction.isCommand()){
            createGrid();
            updateStoredGrid();
        }
        if(interaction.isButton()){
            updateGrid(interaction)
            updateStoredGrid();
        }

        
    },
}

