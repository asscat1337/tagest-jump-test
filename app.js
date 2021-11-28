async function transform(){
    const [postsResponse,usersResponse] = await Promise.all([
        fetch('http://jsonplaceholder.typicode.com/posts'),
        fetch('http://jsonplaceholder.typicode.com/users')
    ])
    const postsData = await postsResponse.json()
    const usersData = await usersResponse.json()
    const transformedPosts = postsData.map(post=>{
        return {
            ...post,
            title_crop:`${post.title.slice(0,20)}...`  
        }
    })
    const transfromedData = usersData.map(user=>{
        return {
            id:user.id,
            name:user.name,
            email:user.email,
            address:`${user.address.city} ${user.address.street}${user.address.suit}`,
            website:`https://${user.website}`,
            company:user.company.name,
            posts: transformedPosts.filter(post=>post.userId === user.id)
        }
    })
    console.log(transfromedData)

     function bonus (currentUser){
        const findCurrentUser=transfromedData.find(user=>user.name === currentUser)

        Promise.all(findCurrentUser.posts.map(async(item)=>{
             const response =  await fetch(`http://jsonplaceholder.typicode.com/posts/${item.id}/comments`)
             const comments = await response.json()
             const mappedData = comments.map(comment=>{
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
         return {
             ...findCurrentUser,
             posts:res.flat()
         }
       }).then(data=>console.log(data))
    }
    bonus("Ervin Howell")
}
transform()