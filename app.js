async function transform(){
    /// запрос к API,использую Promise.all() чтобы получить результат с двух api без ошибок
    const [postsResponse,usersResponse] = await Promise.all([
        fetch('http://jsonplaceholder.typicode.com/posts'),
        fetch('http://jsonplaceholder.typicode.com/users')
    ])
    // парсю в json
    const postsData = await postsResponse.json()
    const usersData = await usersResponse.json()
    // трансформирую массиво объектов постов
    const transformedPosts = postsData.map(post=>{
        return {
            ...post,
            title_crop:`${post.title.slice(0,20)}...`  
        }
    })
    /// объединяю транформированый массив объектов постов с юзерами
    const transfromedData = usersData.map(user=>{
        return {
            id:user.id,
            name:user.name,
            email:user.email,
            address:`${user.address.city} ${user.address.street}${user.address.suit}`,
            website:`https://${user.website}`,
            company:user.company.name,
            posts: transformedPosts.filter(post=>post.userId === user.id) // проверяю id поста с id юзера и если верный возвращается объект
        }
    })
    console.log(transfromedData)

     function bonus (currentUser){
         //нахожу объект конкретного пользователя
        const findCurrentUser=transfromedData.find(user=>user.name === currentUser)

        Promise.all(findCurrentUser.posts.map(async(item)=>{
            //перебираю посты пользователя и делаю запрос к API
             const response =  await fetch(`http://jsonplaceholder.typicode.com/posts/${item.id}/comments`)
             const comments = await response.json()
             const mappedData = comments.map(comment=>{ // трансформирую данные,полученные с API
                 if(comment.postId === item.id ){
                     return {
                         ...item,
                         comment
                     }
                 }
             })
             return mappedData
          })
       ).then(res=>{
         return { // возвращаю сформированный массив
             ...findCurrentUser,
             posts:res.flat()
         }
       }).then(data=>console.log(data))
    }
    bonus("Ervin Howell")
}
transform()