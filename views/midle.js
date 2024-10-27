


export function dataClasse(ecole){
    const db= new sqlite(ecole+'.db')
    db.all("SELECT * FROM  classes ",[],(err, rows) =>{
        if(err){
            console.log(err)
        }
        return rows
    })
}

