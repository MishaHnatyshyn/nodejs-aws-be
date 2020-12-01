import {APIGatewayTokenAuthorizerEvent} from "aws-lambda";

export const basicAuthorizer = (event: APIGatewayTokenAuthorizerEvent) => {
    try {

        const [, authData] = (event?.authorizationToken || '').split('Basic ');

        const decodedUserPwd = Buffer.from(authData, 'base64').toString('utf-8');

        const [username, password] = decodedUserPwd.split('=')
        const storedUserPwd = process.env[username];
        const effect =
            !storedUserPwd || storedUserPwd !== password ? 'Deny' : 'Allow';

        return generatePolicy(authData, event?.methodArn, effect);
    } catch (error) {
        return error;
    }
}

const generatePolicy = (principalId, resource, effect = 'Allow') => {
    return {
        principalId: principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: resource,
                },
            ],
        },
    };
};