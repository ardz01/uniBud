from base.models import Badge

def assign_badges(user):
    badges = Badge.objects.all()
    for badge in badges:
        # Check if user already has the badge
        if badge in user.badges.all():
            continue

        # Check if user meets the criteria to earn the badge
        if check_criteria(user, badge.criteria):
            user.badges.add(badge)
            user.save()




def check_criteria(user, criteria):
    # Example criteria: 'rooms_created:10'
    key, value = criteria.split(':')
    value = int(value)

    if key == 'rooms_created':
        return user.created_rooms.count() >= value
    elif key == 'followers':
        return user.followers.count() >= value
    # Add more criteria checks if needed

    return False
