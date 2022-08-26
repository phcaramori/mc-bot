import  { EmbedBuilder , SlashCommandBuilder , ActionRowBuilder , ButtonBuilder , ButtonStyle } from 'discord.js';
import * as PF from 'pathfinding'
import * as fs from 'fs'

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

        let updateStoredGrid = function(){
            fs.writeFileSync('./json/game.json',JSON.stringify({game: gameBoard, userPosX: userPosX, userPosY: userPosY}))
        }

        let createGrid = async function(){
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

            //load Random Board
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
            }
            updateStoredGrid();
        }

        let updateGrid =  function (interaction){
            let JSONgrid = fs.readFileSync('./json/game.json');
            let parsed = JSON.parse(JSONgrid.toString())
            gameBoard = parsed.game;
            userPosX = parsed.userPosX;
            userPosY = parsed.userPosY;

            gameBoard[userPosY][userPosX] = '◼️' //delete previous position
            if(interaction.customId == 'up')
                userPosY --; 
            else if(interaction.customId == 'right')
                userPosX ++;
            else if(interaction.customId == 'down')
                userPosY ++;
            else if(interaction.customId == 'left')
                userPosX --;

            gameBoard[userPosY][userPosX] = '🟧' // set new position
            let line = '';
            for(let i = 0; i < 7; i++){
                line = line + gameBoard[i].join(' ') + ' \n ';
            }
            let embed = new EmbedBuilder()
            embed.addFields({name: 'Game Board:', value: line})
            interaction.update({ embeds: [embed], components: [row] })
            updateStoredGrid()
        }


        if(interaction.isCommand()){
            createGrid();
            let embed = new EmbedBuilder()
            let line = '';
            for(let i = 0; i < 7; i++){
                line = line + gameBoard[i].join(' ') + ' \n ';
            }
            embed.addFields({name: 'Game Board:', value: line})
            interaction.reply({ embeds: [embed], components: [row] })
        }
        if(interaction.isButton()){
            updateGrid(interaction)
        }

        
    },
}

