// import {createClient} from "@/utils/supabase/server";
//
//
// export async function consumeCredits( id:number, amount:number ) {
//   const supabase = await createClient();
//
//   supabase
//   .from('profiles')
//   .update({ credits: auth.profile.credits - amount })
//   .eq('id', auth.profile.id)
//   .select()
//   .single()
//   .then(({ data, error }) => {
//     error ? console.error(error) : console.log("Supabase credits updated:", data);
//
//     // Update local authAtom
//     setAuth({...auth, profile: {...auth.profile, credits: data.credits}})
//   })
// }
